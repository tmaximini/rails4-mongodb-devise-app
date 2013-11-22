class BackendController < ApplicationController
  def index
    @stories = Story.all
    render 'index'
  end
end
