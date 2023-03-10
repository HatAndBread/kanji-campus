class MakeNameNotNull < ActiveRecord::Migration[7.0]
  def change
    change_column_null :study_sets, :name, false
  end
end
