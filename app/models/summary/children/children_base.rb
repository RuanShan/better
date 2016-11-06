module Summary
  module Children
    class ChildrenBase
      attr_accessor :children_broker
                  # 会员           注册时间        状态
      attr_accessor :broker_name, :sign_up_time, :state

      def initialize( children_broker)
        self.children_broker = children_broker
        self.broker_name = children_broker.nickname
        self.sign_up_time = children_broker.display_created_at
        self.state = children_broker.state
      end
    end
  end
end
