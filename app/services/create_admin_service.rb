class CreateAdminService
  def call
    user = Administrator.find_or_create_by!(email: Rails.application.secrets.admin_email) do |user|
        user.password = Rails.application.secrets.admin_password
        user.password_confirmation = Rails.application.secrets.admin_password
        #user.confirm
        #user.admin!
      end
  end
end
class PublicMessage
  def call
    12.times do |i|
      message = Message.find_or_create_by!(title: "Welcome#{i}!", content: "Welcome to better!") do |message|
        message.user_id=0
        message.state=0
        message.save!
      end
      puts 'CREATED MESSAGE: ' << message.title

      User.all.each do |user|
        UserMessage.find_or_create_by!(user_id: user.id, message_id: message.id) do |user_message|
          user_message.state=0
          user_message.save!
        end
      end
    end
  end
end
