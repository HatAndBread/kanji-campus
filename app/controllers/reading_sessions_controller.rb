class ReadingSessionsController < ApplicationController
  def index
    @study_set = StudySet.find(params[:study_set_id])
    @study_set.reading_sessions.where(completed: false).destroy_all
    @reading_sessions = @study_set.reading_sessions.order(created_at: :asc)
  end

  def update
    @reading_session = ReadingSession.find(params[:id])
    @reading_session.update(reading_session_params)
    redirect_to study_set_reading_sessions_path(@reading_session.study_set_id)
  end

  private

  def reading_session_params
    params.require(:reading_session).permit(:points).merge(completed: true)
  end
end
