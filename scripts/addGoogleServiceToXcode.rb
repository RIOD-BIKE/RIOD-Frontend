#!/usr/bin/env ruby
require 'xcodeproj'
file_name = 'GoogleService-Info.plist'
project_path = 'platforms/ios/RIOD.xcodeproj'
project = Xcodeproj::Project.open(project_path)
file = project.new_file('../../' + file_name)
project.targets.first.resources_build_phase.files.to_a.map do |pbx_build_file|
    if pbx_build_file.display_name == file_name
        puts file_name + ' already added to Xcode project. Skipping.'
        exit(0)
    end
end
project.targets.first.add_resources([file])
puts 'added ' + file_name + ' to Xcode project'
project.save()