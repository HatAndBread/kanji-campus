class PagesController < ApplicationController
  def home
    @study_sets = StudySet.where(public: true).order(name: :desc)
    @my_study_sets = StudySet.where(user: current_user) if current_user
  end

  def privacy_policy
  end

  def menu
    @study_sets = StudySet.where(public: true).order(name: :desc)
    @my_study_sets = StudySet.where(user: current_user) if current_user
  end
end
