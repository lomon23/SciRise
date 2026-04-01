cmake_minimum_required(VERSION 3.10)
project(QtBaseProject)

set(CMAKE_AUTOMOC ON)
set(CMAKE_AUTOUIC ON)
set(CMAKE_AUTORCC ON)

find_package(Qt6 REQUIRED COMPONENTS Widgets Network)

add_executable(QtBaseProject
    src/main.cpp
    src/core/AuthManager/AuthManager.h
    src/core/AuthManager/AuthManager.cpp
    src/ui/LoginForm/LoginForm.h
    src/ui/LoginForm/LoginForm.cpp
)

target_include_directories(QtBaseProject PRIVATE
    src/core/AuthManager
    src/ui/LoginForm
)

target_link_libraries(QtBaseProject Qt6::Widgets Qt6::Network)
