class Story
  include Mongoid::Document

  embeds_many :pictures
end
