class StudySet < ApplicationRecord
  belongs_to :user
  has_many :mondais, dependent: :destroy
  has_many :writing_sessions, dependent: :destroy
  accepts_nested_attributes_for :mondais, reject_if: ->(o) { o[:kanji].blank? || o[:yomikata.blank?] }, allow_destroy: true
  # validates :mondais, length: {minimum: 3, message: ": must be at least 3."}
  validates :name, presence: true
end
