json.array!(@stories) do |story|
  json.extract! story, 
  json.url story_url(story, format: :json)
end
