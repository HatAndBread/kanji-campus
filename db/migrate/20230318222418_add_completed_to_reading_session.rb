class AddCompletedToReadingSession < ActiveRecord::Migration[7.0]
  def change
    add_column :reading_sessions, :completed, :boolean, default: false
  end
end
