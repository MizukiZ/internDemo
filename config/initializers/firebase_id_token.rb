require "redis"
require "firebase_id_token"

FirebaseIdToken.configure do |config|
  # set firebase project id
  config.project_ids = ['authtutorial-12ac0']
  # initialize redis and set 
  config.redis = Redis.new(url: "redis://localhost:6379/0")
end