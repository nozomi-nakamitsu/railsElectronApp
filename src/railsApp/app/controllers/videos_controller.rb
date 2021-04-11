class VideosController < ApplicationController
    before_action :authenticate_user!
    def index
        @video="ここはルートです"
    end

    def  BasicVieoCall
        @video="ここはルートです"
    end
end
