class ApplicationController < ActionController::Base
  include Pagy::Backend

  def render_flash
    render turbo_stream: turbo_stream.update("flash", partial: "shared/flash")
  end
end
