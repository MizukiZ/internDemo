class PlayersController < ApplicationController

  before_action :current_user_validation

  
  def index
    @players = Player.all
    if(params[:request] == 'get')
      return render json: @players
    end
  end

  def new
    @player = Player.new
  end

  def create 
    @player =Player.create(player_params)
  end

  def edit
    @player =Player.find(params[:id])
  end

  def update
    @player =Player.find(params[:id])
    @player.update(player_params)
    
  end

  def destroy
    @player =Player.find(params[:id])
    @player.destroy
   
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
