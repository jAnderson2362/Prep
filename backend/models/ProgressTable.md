## Progress Table

The progress table stores each user's quiz attempts and tracks their learning progress

# id 
- a type of bigserial numbers, that contains unique indetifier for each progress record
# user_id
- a type of UUID, that references auth.user(id) and identifies the user who completed the quiz and studfent that been registered
# topic_id
-  type integer that references topic(id) and identifies the topic that was attempted
# score
- type of integer, that references the number of correct answer
# total questions
- the total number of questions in the quiz
# attempted_at
- is a timestamptz that the date and time the quiz attempted was recorded. defults to the current timestamp

## Relationships

- user_id references the auth_user(id)
- topic_id references topics(id)

## Row Level Security 

-RLS is enable on the progress table to protect the user data and only the user can view, insert, update and delete their own progress record

## Purpose

- The progress table records quiz results for each user it allows the application to track progress and identify a user's weakest topics based on their average quiz scores
