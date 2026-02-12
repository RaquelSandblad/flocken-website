// Statistical functions for A/B testing analysis

/**
 * Normal distribution CDF (cumulative distribution function)
 * Using approximation for standard normal distribution
 */
export function normalCDF(x: number): number {
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;
  const p = 0.3275911;

  const sign = x < 0 ? -1 : 1;
  x = Math.abs(x) / Math.sqrt(2);

  const t = 1.0 / (1.0 + p * x);
  const y = 1.0 - ((((a5 * t + a4) * t + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  return 0.5 * (1.0 + sign * y);
}

/**
 * Z-test for comparing two proportions (conversion rates)
 */
export interface ZTestResult {
  controlRate: number;
  variantRate: number;
  absoluteLift: number;
  relativeLift: number;
  zScore: number;
  pValue: number;
  confidenceLevel: number;
  isSignificant: boolean;
  winner: 'control' | 'variant' | 'none';
  confidenceInterval: {
    lower: number;
    upper: number;
  };
}

export function zTestForProportions(
  controlVisitors: number,
  controlConversions: number,
  variantVisitors: number,
  variantConversions: number,
  significanceLevel: number = 0.05
): ZTestResult {
  const controlRate = controlConversions / controlVisitors;
  const variantRate = variantConversions / variantVisitors;

  const absoluteLift = variantRate - controlRate;
  const relativeLift = controlRate > 0 ? (variantRate - controlRate) / controlRate : 0;

  // Pooled proportion
  const pooledRate = (controlConversions + variantConversions) / (controlVisitors + variantVisitors);

  // Standard error
  const standardError = Math.sqrt(
    pooledRate * (1 - pooledRate) * (1 / controlVisitors + 1 / variantVisitors)
  );

  // Z-score
  const zScore = standardError > 0 ? absoluteLift / standardError : 0;

  // Two-tailed p-value
  const pValue = 2 * (1 - normalCDF(Math.abs(zScore)));

  // Confidence level (as percentage)
  const confidenceLevel = (1 - pValue) * 100;

  // Is significant?
  const isSignificant = pValue < significanceLevel;

  // Winner
  let winner: 'control' | 'variant' | 'none' = 'none';
  if (isSignificant) {
    winner = variantRate > controlRate ? 'variant' : 'control';
  }

  // 95% Confidence interval for the difference
  const zCritical = 1.96; // For 95% CI
  const seDiff = Math.sqrt(
    (controlRate * (1 - controlRate)) / controlVisitors +
    (variantRate * (1 - variantRate)) / variantVisitors
  );

  const confidenceInterval = {
    lower: absoluteLift - zCritical * seDiff,
    upper: absoluteLift + zCritical * seDiff,
  };

  return {
    controlRate,
    variantRate,
    absoluteLift,
    relativeLift,
    zScore,
    pValue,
    confidenceLevel,
    isSignificant,
    winner,
    confidenceInterval,
  };
}

/**
 * Beta distribution functions for Bayesian analysis
 */
function betaFunction(a: number, b: number): number {
  // Using log-gamma approximation
  return Math.exp(logGamma(a) + logGamma(b) - logGamma(a + b));
}

function logGamma(x: number): number {
  // Stirling's approximation
  const c = [
    76.18009172947146,
    -86.50532032941677,
    24.01409824083091,
    -1.231739572450155,
    0.1208650973866179e-2,
    -0.5395239384953e-5,
  ];

  let y = x;
  let tmp = x + 5.5;
  tmp -= (x + 0.5) * Math.log(tmp);
  let ser = 1.000000000190015;

  for (let j = 0; j < 6; j++) {
    ser += c[j] / ++y;
  }

  return -tmp + Math.log((2.5066282746310005 * ser) / x);
}

/**
 * Monte Carlo simulation for Bayesian probability
 * P(variant > control)
 */
export interface BayesianResult {
  probabilityVariantBetter: number;
  probabilityControlBetter: number;
  expectedLossControl: number;
  expectedLossVariant: number;
  recommendation: string;
}

export function bayesianAnalysis(
  controlVisitors: number,
  controlConversions: number,
  variantVisitors: number,
  variantConversions: number,
  simulations: number = 100000
): BayesianResult {
  // Prior: Beta(1, 1) = Uniform distribution (non-informative)
  const priorAlpha = 1;
  const priorBeta = 1;

  // Posterior parameters
  const controlAlpha = priorAlpha + controlConversions;
  const controlBeta = priorBeta + controlVisitors - controlConversions;
  const variantAlpha = priorAlpha + variantConversions;
  const variantBeta = priorBeta + variantVisitors - variantConversions;

  // Monte Carlo simulation
  let variantWins = 0;
  let totalLossControl = 0;
  let totalLossVariant = 0;

  for (let i = 0; i < simulations; i++) {
    const controlSample = sampleBeta(controlAlpha, controlBeta);
    const variantSample = sampleBeta(variantAlpha, variantBeta);

    if (variantSample > controlSample) {
      variantWins++;
      totalLossControl += variantSample - controlSample;
    } else {
      totalLossVariant += controlSample - variantSample;
    }
  }

  const probabilityVariantBetter = variantWins / simulations;
  const probabilityControlBetter = 1 - probabilityVariantBetter;
  const expectedLossControl = totalLossControl / simulations;
  const expectedLossVariant = totalLossVariant / simulations;

  // Recommendation based on probability threshold
  let recommendation: string;
  if (probabilityVariantBetter > 0.95) {
    recommendation = 'Variant är vinnare med hög säkerhet. Implementera varianten.';
  } else if (probabilityControlBetter > 0.95) {
    recommendation = 'Kontroll är bättre. Behåll nuvarande version.';
  } else if (probabilityVariantBetter > 0.8) {
    recommendation = 'Variant ser lovande ut men behöver mer data för säker slutsats.';
  } else if (probabilityControlBetter > 0.8) {
    recommendation = 'Kontroll ser bättre ut men behöver mer data för säker slutsats.';
  } else {
    recommendation = 'Ingen tydlig vinnare ännu. Fortsätt samla data.';
  }

  return {
    probabilityVariantBetter,
    probabilityControlBetter,
    expectedLossControl,
    expectedLossVariant,
    recommendation,
  };
}

/**
 * Sample from Beta distribution using rejection sampling
 */
function sampleBeta(alpha: number, beta: number): number {
  // Using the gamma distribution method
  const x = sampleGamma(alpha);
  const y = sampleGamma(beta);
  return x / (x + y);
}

/**
 * Sample from Gamma distribution using Marsaglia and Tsang's method
 */
function sampleGamma(shape: number): number {
  if (shape < 1) {
    return sampleGamma(shape + 1) * Math.pow(Math.random(), 1 / shape);
  }

  const d = shape - 1 / 3;
  const c = 1 / Math.sqrt(9 * d);

  while (true) {
    let x: number;
    let v: number;

    do {
      x = randomNormal();
      v = 1 + c * x;
    } while (v <= 0);

    v = v * v * v;
    const u = Math.random();

    if (u < 1 - 0.0331 * (x * x) * (x * x)) {
      return d * v;
    }

    if (Math.log(u) < 0.5 * x * x + d * (1 - v + Math.log(v))) {
      return d * v;
    }
  }
}

/**
 * Sample from standard normal distribution using Box-Muller transform
 */
function randomNormal(): number {
  const u1 = Math.random();
  const u2 = Math.random();
  return Math.sqrt(-2 * Math.log(u1)) * Math.cos(2 * Math.PI * u2);
}

/**
 * Calculate minimum sample size needed for given parameters
 */
export interface SampleSizeResult {
  sampleSizePerVariant: number;
  totalSampleSize: number;
  estimatedDaysToComplete: number;
}

export function calculateSampleSize(
  baselineConversionRate: number,
  minimumDetectableEffect: number, // relative, e.g., 0.10 for 10% lift
  power: number = 0.8,
  significanceLevel: number = 0.05,
  dailyVisitors: number = 100
): SampleSizeResult {
  // Z-scores for power and significance
  const zAlpha = 1.96; // Two-tailed 95%
  const zBeta = 0.84; // 80% power

  const p1 = baselineConversionRate;
  const p2 = baselineConversionRate * (1 + minimumDetectableEffect);
  const pooledP = (p1 + p2) / 2;

  // Sample size formula for comparing two proportions
  const numerator = Math.pow(
    zAlpha * Math.sqrt(2 * pooledP * (1 - pooledP)) +
    zBeta * Math.sqrt(p1 * (1 - p1) + p2 * (1 - p2)),
    2
  );
  const denominator = Math.pow(p2 - p1, 2);

  const sampleSizePerVariant = Math.ceil(numerator / denominator);
  const totalSampleSize = sampleSizePerVariant * 2;
  const estimatedDaysToComplete = Math.ceil(totalSampleSize / dailyVisitors);

  return {
    sampleSizePerVariant,
    totalSampleSize,
    estimatedDaysToComplete,
  };
}

/**
 * Format statistics result as readable text
 */
export function formatExperimentReport(
  experimentId: string,
  experimentName: string,
  controlVisitors: number,
  controlConversions: number,
  variantVisitors: number,
  variantConversions: number,
  variantId: string = 'variant_b',
  daysRunning: number = 0
): string {
  const zTest = zTestForProportions(
    controlVisitors,
    controlConversions,
    variantVisitors,
    variantConversions
  );

  const bayesian = bayesianAnalysis(
    controlVisitors,
    controlConversions,
    variantVisitors,
    variantConversions
  );

  const controlRatePercent = (zTest.controlRate * 100).toFixed(2);
  const variantRatePercent = (zTest.variantRate * 100).toFixed(2);
  const relativeLiftPercent = (zTest.relativeLift * 100).toFixed(1);
  const confidencePercent = zTest.confidenceLevel.toFixed(1);
  const bayesianPercent = (bayesian.probabilityVariantBetter * 100).toFixed(1);

  let report = `## A/B Test Rapport: ${experimentName}\n\n`;
  report += `**Experiment ID:** ${experimentId}\n`;
  report += `**Dagar aktiv:** ${daysRunning}\n\n`;

  report += `### Resultat\n\n`;
  report += `| Variant | Visningar | Konverteringar | Konverteringsgrad |\n`;
  report += `|---------|-----------|----------------|-------------------|\n`;
  report += `| Kontroll | ${controlVisitors.toLocaleString()} | ${controlConversions.toLocaleString()} | ${controlRatePercent}% |\n`;
  report += `| ${variantId} | ${variantVisitors.toLocaleString()} | ${variantConversions.toLocaleString()} | ${variantRatePercent}% |\n\n`;

  report += `### Analys\n\n`;
  report += `- **Relativ förändring:** ${relativeLiftPercent}%\n`;
  report += `- **Statistisk signifikans:** ${confidencePercent}% ${zTest.isSignificant ? '✅' : '⏳'}\n`;
  report += `- **P-värde:** ${zTest.pValue.toFixed(4)}\n`;
  report += `- **Bayesian sannolikhet (variant bättre):** ${bayesianPercent}%\n\n`;

  report += `### Rekommendation\n\n`;

  if (zTest.isSignificant && zTest.winner === 'variant') {
    report += `🏆 **${variantId} är vinnare!** Statistiskt signifikant med ${confidencePercent}% säkerhet.\n\n`;
    report += `Du kan avsluta testet och implementera varianten permanent.\n`;
  } else if (zTest.isSignificant && zTest.winner === 'control') {
    report += `📊 **Kontroll är bättre.** Statistiskt signifikant med ${confidencePercent}% säkerhet.\n\n`;
    report += `Behåll nuvarande version.\n`;
  } else {
    report += `⏳ **Ingen vinnare ännu.** ${bayesian.recommendation}\n\n`;

    // Calculate how much more data needed
    if (controlVisitors + variantVisitors < 1000) {
      report += `Rekommendation: Fortsätt tills du har minst 500 visningar per variant.\n`;
    } else {
      report += `Rekommendation: Fortsätt samla data eller överväg att testa en mer distinkt variant.\n`;
    }
  }

  return report;
}
