class BackendController < ApplicationController
  layout 'backend'
  def index
    @stories = Story.all
    render 'index'
  end
end
