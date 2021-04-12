class User < ApplicationRecord
  # Include default devise modules. Others available are:
  # :confirmable, :lockable, :timeoutable, :trackable and :omniauthable
  devise :database_authenticatable, :registerable,
         :recoverable, :rememberable, :validatable
  #  半角英数字だけ許可する
  VALID_UID_REGEX = /\A[a-z0-9]+\z/i
  validates :uid, format: { with: VALID_UID_REGEX }
end
