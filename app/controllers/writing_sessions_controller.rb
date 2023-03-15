class WritingSessionsController < ApplicationController
  def index
    @study_set = StudySet.find(params[:study_set_id])
    @study_set.writing_sessions.where(answered: 0).destroy_all
    @writing_sessions = @study_set.writing_sessions.order(created_at: :asc)
  end

  def update
    @writing_session = WritingSession.find(params[:id])
    @writing_session.update(writing_session_params) unless writing_session_params[:answered].to_i == 0
    redirect_to study_set_writing_sessions_path(@writing_session.study_set_id)
  end

  private

  def writing_session_params
    params.require(:writing_session).permit(:correct, :answered)
  end
end
