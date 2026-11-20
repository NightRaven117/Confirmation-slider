/** Mock data for the redeem flow, matching the Figma content. */

export const redeem = {
  fundName: 'ICICI Prudential Dividend Yield Equity...',
  fundTitleLong: 'Redeem ICICI Prudential Dividend Yield ...',
  available: '₹12,34,567.89 available',

  amount: '₹1,23,45,678',
  navDate: '06 Nov',

  // Entry screen
  exitLoadCharge: '₹230.45',
  bankLabel: 'Axis Bank ••••1234',
  bankSubtext: 'Expected transfer by 13 Jun',

  // Confirmation sheet
  redeemBank: 'ICICI Bank ••••2324',
  units: '165.456',
  exitLoadApprox: '₹23.45',
  ltcg: '+₹1,90,000',
  stcg: '-₹2,31,000',
  avoidStcgAmount: '₹10,14,112',

  // Success screen
  successAmount: '₹12,34,567.89',
  unitsRedeemed: '160.687',
  successNavDate: "12 Sep '21",
  completionBy: "15 Sep '21",
} as const;
