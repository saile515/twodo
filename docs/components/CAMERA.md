# Camera Component

## Description

A 2D camera.

## Constructor Parameters

- viewport_width <number> Width of canvas.
- viewport_height <number> Height of canvas.

## Properties

- projection_matrix <read-only gl-matrix.mat3> The camera's projection matrix.

## Methods

- calculate_projection_matrix(viewport_width, viewport_height) <void> Recalculates the camera's projection matrix.
    - viewport_width <number> Width of canvas.
    - viewport_height <number> Height of canvas.
