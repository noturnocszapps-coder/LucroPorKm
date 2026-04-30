export interface CalculationConfig {
  fuelPrice: number;
  avgConsumption: number;
  fixedCostsMonthly: number;
  maintenanceMonthly: number;
}

export function calculateDailyMetrics(
  grossRevenue: number,
  totalKm: number,
  config: CalculationConfig,
  extraExpensesTotal: number = 0
) {
  const fuelCostPerKm = config.fuelPrice / config.avgConsumption;
  const fuelCostTotal = totalKm * fuelCostPerKm;
  
  const dailyFixedCost = config.fixedCostsMonthly / 30;
  const dailyMaintenanceReserve = config.maintenanceMonthly / 30;
  
  const totalCost = fuelCostTotal + dailyFixedCost + dailyMaintenanceReserve + extraExpensesTotal;
  const netProfit = grossRevenue - totalCost;
  
  const profitPerKm = totalKm > 0 ? netProfit / totalKm : 0;
  const revenuePerKm = totalKm > 0 ? grossRevenue / totalKm : 0;
  
  return {
    fuelCostTotal,
    dailyFixedCost,
    dailyMaintenanceReserve,
    totalCost,
    netProfit,
    profitPerKm,
    revenuePerKm,
    margin: grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0
  };
}

export function getProfitMessage(profitPerKm: number) {
  if (profitPerKm >= 1.5) return { text: "Excelente lucro por KM!", color: "text-emerald-400" };
  if (profitPerKm >= 0.8) return { text: "Bom lucro por KM.", color: "text-green-400" };
  if (profitPerKm > 0) return { text: "Lucro baixo. Cuidado com os custos.", color: "text-yellow-400" };
  return { text: "Prejuízo! Revise sua operação.", color: "text-red-400" };
}
