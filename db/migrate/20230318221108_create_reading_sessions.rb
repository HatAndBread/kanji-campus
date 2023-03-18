class CreateReadingSessions < ActiveRecord::Migration[7.0]
  def change
    create_table :reading_sessions do |t|
      t.references :study_set, null: false, foreign_key: true
      t.references :user, null: false, foreign_key: true
      t.integer :points, default: 0

      t.timestamps
    end
  end
end
