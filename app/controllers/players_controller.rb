class PlayersController < ApplicationController

  before_action :current_user_validation

  
  def index
    @players = Player.all
  end

  def new
    @player = Player.new
  end

  def create 
    @player =Player.create(player_params)

    if @player.save
      redirect_to players_path
    else
      render 'new'
    end
  end

  def edit
    @player =Player.find(params[:id])
  end

  def update
    @player =Player.find(params[:id])

    if @player.update(player_params)
      redirect_to players_path
    else
      render 'edit'
    end
  end

  def destroy
    @player =Player.find(params[:id])

    @player.destroy
    redirect_to players_path
  end

  private
  # Never trust parameters from the scary internet, only allow the white list through.
  def player_params
    params.require(:player).permit(:name)
  end

  def current_user_validation
    redirect_to root_path if !session[:current_user]
  end

end
