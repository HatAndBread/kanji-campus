class PagesController < ApplicationController
  def home
    @study_sets = StudySet.where(public: true)
    @my_study_sets = StudySet.where(user: current_user) if current_user
  end

  def privacy_policy
  end
end
