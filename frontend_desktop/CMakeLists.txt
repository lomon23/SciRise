cmake_minimum_required(VERSION 3.10)
project(QtBaseProject)

set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTOUIC ON)
set(CMAKE_AUTORCC ON)

find_package(Qt6 REQUIRED COMPONENTS Widgets)

add_executable(QtBaseProject
    main.cpp
    AuthManager/AuthManager.h
    AuthManager/AuthManager.cpp
)
target_link_libraries(QtBaseProject Qt6::Widgets Qt6::Network)