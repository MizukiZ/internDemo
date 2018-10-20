class AuthenticationController < ApplicationController
  skip_before_action :verify_authenticity_token

  def login

    if params[:email]
      # set user info in session
      session[:user_email] = params[:email]
      # return json data to js file
      return render json: {"path"=> posts_path}
    end

    #  when token is sent
    if params[:token]
      # get certificate using firebase token library
      FirebaseIdToken::Certificates.request
      # verity the token using firebase token library
      tokenData = FirebaseIdToken::Signature.verify(params[:token])

      # return json user data to js file
      return render json: {"tokenData"=> tokenData}
    end
  end

  def logout
    # destroy the session when user logout
    reset_session
    return render json: {"sessionD"=> "delete"}
  end

  def index
  end

  def create
  end

  def new
  end

end
end
