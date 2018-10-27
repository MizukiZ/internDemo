class TeamsController < ApplicationController
  before_action :current_user_validation

  
  def index
    @teams = Team.all

    if(params[:request] == 'get')
      return render json: @teams
    end

  end

  def create 
    @team =Team.create(team_params)
  end

  def update
    @team =Team.find(params[:id])
    @team.update(team_params)
    
  end

  def destroy
    @team =Team.find(params[:id])

    @team.destroy
  end

  private
  # Never trust parameters from the scary internet, only allow the white list through.
  def team_params
    params.require(:team).permit(:name)
  end

  def current_user_validation
    redirect_to root_path if !session[:current_user]
  end

end
