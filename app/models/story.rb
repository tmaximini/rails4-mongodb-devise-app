class Story
  include Mongoid::Document
  include Mongoid::Timestamps

  field :title, type: String
  field :date, type: String
  field :elements, type: Hash
  field :_id, type: String, default: -> { title.to_s.parameterize } # overwrite _id to make it readable

  # embeds_many :pictures
end
