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
  { name:"现货黄金", code: 'CRXAU', category_id: 3, hot: true },
  { name:"现货白银", code: 'CRXAG', category_id: 3, hot: true },
  { name:"现货铂金", code: 'CRXAP', category_id: 3, hot: true },
  { name:"原油连续", code: 'CXSLN2', category_id: 3, hot: true },
  { name:"期铜连续", code: 'SQCOS0', category_id: 3, hot: true },
]
attributes.each{|attrs|
  GameInstrument.create!( attrs)
}
