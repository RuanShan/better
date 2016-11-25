module Summary
  module Children
    class SaleBase
      attr_accessor :seller
                  # 会员           注册时间        状态
      attr_accessor :sign_up_time, :state
      #delegate :parent_name, to: :seller, prefix: true

      def initialize( seller)
        self.seller = seller
        self.sign_up_time = seller.display_created_at
        self.state = seller.state
      end

      def seller_name
        seller.real_name
      end

      def seller_parent_name
        seller.parent.real_name
      end

    end
  end
end
