# 封装 broker & user 以便统计其营销信息
class CurrentSeller
  attr_accessor :seller, :is_user

  delegate :sale_days, :sale_months, :present?, :number, to: :seller
  delegate :energetic_member_count, :clink_visits, :member_count, to: :seller

  def initialize( seller)
    self.seller = seller
    self.is_user = ( seller.type == 'User' )
  end

  def members
    is_user ? seller.children : seller.members
  end

  def member_months
    is_user ? seller.child_months : seller.member_months
  end

  def member_days
    is_user ? seller.child_days : seller.member_days
  end

  def member_cmonths
    is_user ? seller.child_cmonths : seller.member_cmonths
  end

  def member_todays
    is_user ? seller.child_todays : seller.member_todays
  end

  def broker?
    seller.type == 'Broker'
  end

end
