export interface CalculationConfig {
  fuelPrice: number;
  avgConsumption: number;
  
  // Vehicle Tenure
  vehicleType: 'proprio' | 'financiado' | 'alugado';
  rentFrequency?: 'semanal' | 'mensal';
  rentValue?: number;
  financingInstallment?: number;
  
  // Fixed Costs
  insuranceMonthly: number;
  internetMonthly: number;
  washMonthly: number;
  otherFixedMonthly: number;
  
  // Reserves (Maintenance)
  maintenanceMonthly: number;
  tiresMonthly: number;
  oilMonthly: number;
  brakesMonthly: number;
  unexpectedMonthly: number;
}

export function calculateMonthlyFixedCosts(config: Partial<CalculationConfig>) {
  let total = 0;
  
  // Handle vehicle possession cost
  if (config.vehicleType === 'alugado') {
    const rentValue = config.rentValue || 0;
    if (config.rentFrequency === 'semanal') {
      total += rentValue * 4.33;
    } else {
      total += rentValue;
    }
  } else if (config.vehicleType === 'financiado') {
    total += config.financingInstallment || 0;
  }
  
  // Sum other fixed costs
  total += (config.insuranceMonthly || 0);
  total += (config.internetMonthly || 0);
  total += (config.washMonthly || 0);
  total += (config.otherFixedMonthly || 0);
  
  return total;
}

export function calculateMonthlyReserves(config: Partial<CalculationConfig>) {
  let total = 0;
  total += (config.maintenanceMonthly || 0);
  total += (config.tiresMonthly || 0);
  total += (config.oilMonthly || 0);
  total += (config.brakesMonthly || 0);
  total += (config.unexpectedMonthly || 0);
  return total;
}

export function calculateDailyMetrics(
  grossRevenue: number,
  totalKm: number,
  config: CalculationConfig,
  extraExpensesTotal: number = 0
) {
  // Fuel cost is estimated based on KM and consumption
  const fuelCostPerKm = config.fuelPrice / config.avgConsumption;
  const estimatedFuelCost = totalKm * fuelCostPerKm;
  
  const monthlyFixedTotal = calculateMonthlyFixedCosts(config);
  const monthlyReservesTotal = calculateMonthlyReserves(config);
  
  const dailyFixedCost = monthlyFixedTotal / 30;
  const dailyMaintenanceReserve = monthlyReservesTotal / 30;
  
  // Total cost includes the estimated fuel (or real if supplied as extra expense, 
  // but usually we use estimated for per-km projection) + daily splits + daily variable costs
  const totalCost = estimatedFuelCost + dailyFixedCost + dailyMaintenanceReserve + extraExpensesTotal;
  const netProfit = grossRevenue - totalCost;
  
  const profitPerKm = totalKm > 0 ? netProfit / totalKm : 0;
  const revenuePerKm = totalKm > 0 ? grossRevenue / totalKm : 0;
  const costPerKm = totalKm > 0 ? totalCost / totalKm : 0;
  
  return {
    estimatedFuelCost,
    dailyFixedCost,
    dailyMaintenanceReserve,
    totalCost,
    netProfit,
    profitPerKm,
    revenuePerKm,
    costPerKm,
    monthlyFixedTotal,
    monthlyReservesTotal,
    margin: grossRevenue > 0 ? (netProfit / grossRevenue) * 100 : 0
  };
}

export function getProfitMessage(profitPerKm: number) {
  if (profitPerKm >= 1.5) return { text: "Excelente lucro por KM!", color: "text-emerald-400" };
  if (profitPerKm >= 0.8) return { text: "Bom lucro por KM.", color: "text-green-400" };
  if (profitPerKm > 0) return { text: "Lucro baixo. Cuidado com os custos.", color: "text-yellow-400" };
  return { text: "Prejuízo! Revise sua operação.", color: "text-red-400" };
}
