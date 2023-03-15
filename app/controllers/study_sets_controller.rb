class StudySetsController < ApplicationController
  before_action :authenticate_user!, only: %i[index create edit update new destroy]

  def index
    @pagy, @study_sets = pagy(StudySet.includes(:mondais).where(user: current_user), items: 8)
  end

  def show
    @study_set = StudySet.includes(:mondais).find(params[:id])
    @writing_session = WritingSession.create(user: current_user, study_set: @study_set) if current_user
  end

  def new
    @study_set = StudySet.new
    3.times { @study_set.mondais.build }
  end

  def create
    @study_set = StudySet.new(study_set_params)
    if @study_set.save
      flash[:notice] = "Successfully created new study set"
      redirect_to action: "show", id: @study_set
    else
      flash.now[:alert] = "The following errors occurred: \n ☞ #{@study_set.errors.full_messages.join("\n ☞")}"
      render_flash
    end
  end

  def edit
    @study_set = StudySet.includes(:mondais).find(params[:id])
  end

  def update
    @study_set = StudySet.find(params[:id])
    @study_set.mondais.destroy_all
    if @study_set.update(study_set_params)
      flash[:notice] = "Successfully updated new study set"
      redirect_to action: "show", id: @study_set
    else
      flash.now[:alert] = "There was a problem saving this study set. #{@study_set.errors}"
      render_flash
    end
  end

  def destroy
    @study_set = StudySet.find(params[:id])
    flash[:notice] = "Successfully deleted study set: #{@study_set.name}"
    @study_set.destroy
    redirect_to study_sets_path
  end

  private

  def study_set_params
    params.require(:study_set)
      .permit(:name, mondais_attributes: %i[yomikata kanji])
      .merge(user: current_user)
  end

  def update_params
    params.require(:study_set)
      .permit(:name, mondais_attributes: %i[yomikata kanji])
  end
end
