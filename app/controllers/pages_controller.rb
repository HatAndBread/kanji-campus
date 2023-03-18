class PagesController < ApplicationController
  def home
    @study_sets = StudySet.where(public: true).order(name: :desc)
    @my_study_sets = StudySet.where(user: current_user) if current_user
  end

  def privacy_policy
  end

  def menu
    @study_sets = StudySet.where(public: true).order(name: :desc)
    @pagy, @my_study_sets = pagy(StudySet.where(user: current_user).order(created_at: :desc), items: 8) if current_user
  end
end
