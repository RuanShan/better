require 'redis'

$redis = Redis.new()

$redis.select(0)
