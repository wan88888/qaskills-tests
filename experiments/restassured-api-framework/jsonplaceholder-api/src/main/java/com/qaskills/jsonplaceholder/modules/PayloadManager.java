package com.qaskills.jsonplaceholder.modules;

import com.github.javafaker.Faker;
import com.google.gson.Gson;
import com.google.gson.reflect.TypeToken;
import com.qaskills.jsonplaceholder.pojos.request.Comment;
import com.qaskills.jsonplaceholder.pojos.request.Post;
import com.qaskills.jsonplaceholder.pojos.request.Todo;
import com.qaskills.jsonplaceholder.pojos.response.User;

import java.lang.reflect.Type;
import java.util.List;

public class PayloadManager {

    private Gson gson;

    private Gson gson() {
        if (gson == null) {
            gson = new Gson();
        }
        return gson;
    }

    public String createPostPayloadAsString() {
        Post post = new Post();
        post.setUserId(1);
        post.setTitle("REST Assured API test post");
        post.setBody("Created via PayloadManager and GSON");
        return gson().toJson(post);
    }

    public String createPostPayloadFaker() {
        Faker faker = new Faker();
        Post post = new Post();
        post.setUserId(faker.number().numberBetween(1, 10));
        post.setTitle(faker.lorem().sentence(6));
        post.setBody(faker.lorem().paragraph(2));
        return gson().toJson(post);
    }

    public String updatePostTitlePayload(String title) {
        Post post = new Post();
        post.setTitle(title);
        return gson().toJson(post);
    }

    public String createCommentPayloadAsString() {
        Comment comment = new Comment();
        comment.setPostId(1);
        comment.setName("API Tester");
        comment.setEmail("tester@example.com");
        comment.setBody("Comment from REST Assured framework");
        return gson().toJson(comment);
    }

    public String createTodoPayloadAsString() {
        Todo todo = new Todo();
        todo.setUserId(1);
        todo.setTitle("Learn REST Assured framework");
        todo.setCompleted(false);
        return gson().toJson(todo);
    }

    public String updateTodoCompletedPayload(boolean completed) {
        Todo todo = new Todo();
        todo.setCompleted(completed);
        return gson().toJson(todo);
    }

    public Post postFromJson(String json) {
        return gson().fromJson(json, Post.class);
    }

    public Comment commentFromJson(String json) {
        return gson().fromJson(json, Comment.class);
    }

    public Todo todoFromJson(String json) {
        return gson().fromJson(json, Todo.class);
    }

    public User userFromJson(String json) {
        return gson().fromJson(json, User.class);
    }

    public List<Post> postListFromJson(String json) {
        Type type = new TypeToken<List<Post>>() {
        }.getType();
        return gson().fromJson(json, type);
    }

    public List<Comment> commentListFromJson(String json) {
        Type type = new TypeToken<List<Comment>>() {
        }.getType();
        return gson().fromJson(json, type);
    }

    public List<Todo> todoListFromJson(String json) {
        Type type = new TypeToken<List<Todo>>() {
        }.getType();
        return gson().fromJson(json, type);
    }

    public List<User> userListFromJson(String json) {
        Type type = new TypeToken<List<User>>() {
        }.getType();
        return gson().fromJson(json, type);
    }
}
