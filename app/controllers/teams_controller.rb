class TeamsController < ApplicationController
  before_action :current_user_validation

  
  def index
  end

  private 
  def current_user_validation
    redirect_to root_path if !session[:current_user]
  end

end
