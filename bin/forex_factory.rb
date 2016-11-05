require "em-eventsource"
EM.run do
  source = EventMachine::EventSource.new("http://example.com/streaming")
  source.message do |message|
    puts "new message #{message}"
  end
  source.start # Start listening
end
