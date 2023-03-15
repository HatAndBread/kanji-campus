class WritingSession < ApplicationRecord
  belongs_to :study_set
  belongs_to :user
end
