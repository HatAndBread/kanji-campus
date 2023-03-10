class CreateMondais < ActiveRecord::Migration[7.0]
  def change
    create_table :mondais do |t|
      t.string :kanji
      t.string :yomikata
      t.references :study_set, null: false, foreign_key: true

      t.timestamps
    end
  end
end
