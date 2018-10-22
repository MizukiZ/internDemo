class TeamsController < ApplicationController
  before_action :current_user_validation
  before_action :find_team,only: [:show,:update,:edit,:destroy]
  
  def index
    @teams = Team.all
  end

  def new
    @team = Team.new
  end

  def create 
    @team =Team.create(team_params)

    if @team.save
      redirect_to teams_path
    else
      render 'new'
    end
  end

  def edit
  end

  def update
    if @team.update(team_params)
      redirect_to teams_path
    else
      render 'edit'
    end
  end

  def destroy
    @team.destroy
    redirect_to teams_path
  end

  private
  # Never trust parameters from the scary internet, only allow the white list through.
  def team_params
    params.require(:team).permit(:name)
  end

  def current_user_validation
    redirect_to root_path if !session[:current_user]
  end

  def find_team
    @team = Team.find(params[:id])
  end

end
