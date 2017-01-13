attributes = [
  #[ 'USAUDUSD', 'USEURUSD','USGBPUSD','USNZDUSD','USUSDCAD' ,'USUSDCNY','USUSDHKD','USUSDJPY','USUSDMOP','USUSDMYR','USUSDSGD']
  { name:"美汇欧元", code: 'USEURUSD', category_id: 0, hot: true },
  { name:"美汇英镑", code: 'USGBPUSD', category_id: 0, hot: true },
  { name:"美汇澳元", code: 'USAUDUSD', category_id: 0, hot: true },
  { name:"美汇加元", code: 'USUSDCAD', category_id: 0, hot: true },
  { name:"美汇纽元", code: 'USNZDUSD', category_id: 0, hot: true },
  { name:"人 民 币", code: 'USUSDCNY', category_id: 0 },
  { name:"美汇港元", code: 'USUSDHKD', category_id: 0, hot: true },
  { name:"美汇日元", code: 'USUSDJPY', category_id: 0, hot: true },
  { name:"美元兑葡币", code: 'USUSDMOP', category_id: 0 },
  { name:"美汇马币", code: 'USUSDMYR', category_id: 0 },
  { name:"美汇新元", code: 'USUSDSGD', category_id: 0 },
  # 上证指数,深证成指,恒生指数,美元指数,道琼工业,纳斯达克,日经指数,标普500
  # [ 'SH1A0001','IDSPCI','HKHSIO','USDINIW','IDDJSII','IDNQCI','IDNICI']
  { name:"上证指数", code: 'SH1A0001', category_id: 1 },
  { name:"深证成指", code: 'IDSPCI', category_id: 1 },
  { name:"美元指数", code: 'HKHSIO', category_id: 1, hot: true },
  { name:"道琼工业", code: 'USDINIW', category_id: 1, hot: true },
  { name:"纳斯达克", code: 'IDDJSII', category_id: 1, hot: true },
  { name:"日经指数", code: 'IDNQCI', category_id: 1, hot: true },
  { name:"标普500", code: 'IDNICI', category_id: 1, hot: true },

  #长江实业,中电控股,香港中华煤气,九龙仓集团,汇丰控股,电能实业,凯富能源,电讯盈科,长和国际实业,恒隆集团
  #[ 'HKHK0001','HKHK0002','HKHK0003','HKHK0004','HKHK0005','HKHK0006','HKHK0007','HKHK0008','HKHK0009','HKHK0010']
  { name:"长江实业", code: 'HKHK0001', category_id: 2, hot: true },
  { name:"中电控股", code: 'HKHK0002', category_id: 2, hot: true },
  { name:"香港中华煤气", code: 'HKHK0003', category_id: 2, hot: true },
  { name:"九龙仓集团", code: 'HKHK0004', category_id: 2, hot: true },
  { name:"汇丰控股", code: 'HKHK0005', category_id: 2, hot: true },
  { name:"电能实业", code: 'HKHK0006', category_id: 2, hot: true },
  { name:"凯富能源", code: 'HKHK0007', category_id: 2, hot: true },
  { name:"电讯盈科", code: 'HKHK0008', category_id: 2 },
  { name:"长和国际实业", code: 'HKHK0009', category_id: 2 },
  { name:"恒隆集团", code: 'HKHK0010', category_id: 2 },

  # 现货黄金,现货白银,现货铂金,原油连续,白银连续,期铜连续
  # [ 'CRXAU','CRXAG','CRXAP','NYCON0','CXSLN2' ,'SQCOS0']
  { name:"现货黄金", code: 'GOLD', category_id: 3, hot: true },
  { name:"现货白银", code: 'CRXAG', category_id: 3, hot: true },
  { name:"现货铂金", code: 'CRXAP', category_id: 3, hot: true },
  { name:"原油连续", code: 'CXSLN2', category_id: 3, hot: true },
  { name:"期铜连续", code: 'SQCOS0', category_id: 3, hot: true },
]

attributes = [
  #[ 'USAUDUSD', 'USEURUSD','USGBPUSD','USNZDUSD','USUSDCAD' ,'USUSDCNY','USUSDHKD','USUSDJPY','USUSDMOP','USUSDMYR','USUSDSGD']
  { name:"美元/瑞郎", code: 'USDCHF', category_id: 0, scales: 5, hot: true },
  { name:"美元/加元", code: 'USDCAD', category_id: 0, scales: 5, hot: true },
  { name:"美元/日元", code: 'USDJPY', category_id: 0, scales: 3, hot: true },
  { name:"欧元/澳元", code: 'EURAUD', category_id: 0, scales: 5, hot: true },
  { name:"欧元/加元", code: 'EURCAD', category_id: 0, scales: 5, },
  { name:"欧元/瑞郎", code: 'EURCHF', category_id: 0, scales: 5, hot: true },
  { name:"欧元/英镑", code: 'EURGBP', category_id: 0, scales: 5 },
  { name:"欧元/日元", code: 'EURJPY', category_id: 0, scales: 3 },
  { name:"欧元/美金", code: 'EURUSD', category_id: 0, scales: 5 },

  { name:"英镑/澳元", code: 'GBPAUD', category_id: 0, scales: 5, },
  { name:"英镑/加元", code: 'GBPCAD', category_id: 0, scales: 5, hot: true },
  { name:"英镑/日元", code: 'GBPJPY', category_id: 0, scales: 3 },
  { name:"英镑/美元", code: 'GBPUSD', category_id: 0, scales: 5 },
  { name:"英镑/瑞郎", code: 'GBPCHF', category_id: 0, scales: 5 },

  { name:"澳元/瑞郎", code: 'AUDCHF', category_id: 0, scales: 5, },
  { name:"澳元/日元", code: 'AUDJPY', category_id: 0, scales: 3, hot: true },
  { name:"澳元/美金", code: 'AUDUSD', category_id: 0, scales: 5 },
  { name:"澳元/纽元", code: 'AUDNZD', category_id: 0, scales: 5 },
  { name:"纽元/美金", code: 'NZDUSD', category_id: 0, scales: 5 },
  { name:"纽元/日元", code: 'NZDJPY', category_id: 0, scales: 3 },

  # 上证指数,深证成指,恒生指数,美元指数,道琼工业,纳斯达克,日经指数,标普500
  # [ 'SH1A0001','IDSPCI','HKHSIO','USDINIW','IDDJSII','IDNQCI','IDNICI']
  { name:"恒生指数", code: 'HSI', category_id: 1, scales: 0  },
  { name:"纳斯达克指数", code: 'NAS100', category_id: 1, scales: 2 },
  { name:"德国股指", code: 'DAX30', category_id: 1, scales: 2, hot: true },
  { name:"富时A50", code: 'CHINA50', category_id: 1, scales: 2, hot: true },
  { name:"道琼斯指数", code: 'DJ30', category_id: 1, scales: 0, hot: true },
  { name:"日经指数", code: 'NK225', category_id: 1, scales: 0, hot: true },
  { name:"英国富时指数", code: 'FT100', category_id: 1, scales: 2, hot: true },
  { name:"普尔指数", code: 'SP500', category_id: 1, scales: 2, hot: true },

  #长江实业,中电控股,香港中华煤气,九龙仓集团,汇丰控股,电能实业,凯富能源,电讯盈科,长和国际实业,恒隆集团
  #[ 'HKHK0001','HKHK0002','HKHK0003','HKHK0004','HKHK0005','HKHK0006','HKHK0007','HKHK0008','HKHK0009','HKHK0010']


  # 现货黄金,现货白银,现货铂金,原油连续,白银连续,期铜连续
  # [ 'CRXAU','CRXAG','CRXAP','NYCON0','CXSLN2' ,'SQCOS0']
  { name:"美国原油", code: 'US_OIL', category_id: 3, scales: 2, hot: true },
  { name:"英国原油", code: 'UK_OIL', category_id: 3, scales: 2, hot: true },
  { name:"铜", code: 'COPPER', category_id: 3, scales: 4, hot: true },
  { name:"大豆", code: 'SOYBEAN', category_id: 3, scales: 2, hot: true },
  { name:"天然气", code: 'NATGAS', category_id: 3, scales: 3, hot: true },
  { name:"黄金", code: 'GOLD', category_id: 3 , scales: 2 },
  { name:"白银", code: 'XAGUSD', category_id: 3, scales: 3},
  { name:"铂金", code: 'XPTUSD', category_id: 3 , scales: 3 },
  { name:"钯金", code: 'XPDUSD', category_id: 3, scales: 3},
]

GameInstrument.delete_all
attributes.each{|attrs|
  GameInstrument.create!( attrs)
}
