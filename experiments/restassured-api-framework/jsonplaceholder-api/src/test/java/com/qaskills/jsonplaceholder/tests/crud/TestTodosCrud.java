package com.qaskills.jsonplaceholder.tests.crud;

import com.qaskills.jsonplaceholder.base.BaseTest;
import com.qaskills.jsonplaceholder.endpoints.APIConstants;
import com.qaskills.jsonplaceholder.pojos.request.Todo;
import io.qameta.allure.Description;
import io.qameta.allure.Owner;
import io.restassured.RestAssured;
import org.testng.annotations.Test;

import java.util.List;

import static org.assertj.core.api.Assertions.assertThat;

public class TestTodosCrud extends BaseTest {

    @Test(groups = "reg", priority = 1)
    @Owner("qaskills")
    @Description("GET /todos?userId=1 - filter todos by user")
    public void testGetTodosByUserId() {
        response = RestAssured.given(requestSpecification)
                .basePath(APIConstants.TODOS_URL)
                .queryParam("userId", 1)
                .when()
                .get();

        validatableResponse = response.then();
        validatableResponse.statusCode(200);

        List<Todo> todos = payloadManager.todoListFromJson(response.asString());
        assertThat(todos).isNotEmpty();
        assertThat(todos).allMatch(todo -> todo.getUserId().equals(1));
    }

    @Test(groups = "reg", priority = 2)
    @Description("GET /todos/1 - retrieve single todo")
    public void testGetTodoById() {
        response = RestAssured.given(requestSpecification)
                .basePath(APIConstants.TODOS_URL + "/1")
                .when()
                .get();

        validatableResponse = response.then();
        validatableResponse.statusCode(200);

        Todo todo = payloadManager.todoFromJson(response.asString());
        assertActions.verifyResponseBody(todo.getId(), 1, "todo id");
        assertActions.verifyStringKeyNotNull(todo.getTitle());
    }

    @Test(groups = "reg", priority = 3)
    @Description("POST /todos - create todo")
    public void testCreateTodo() {
        response = RestAssured.given(requestSpecification)
                .basePath(APIConstants.TODOS_URL)
                .body(payloadManager.createTodoPayloadAsString())
                .when()
                .post();

        validatableResponse = response.then();
        validatableResponse.statusCode(201);

        Todo todo = payloadManager.todoFromJson(response.asString());
        assertActions.verifyResponseBody(todo.getId(), 201, "created todo id");
        assertThat(todo.getCompleted()).isFalse();
    }

    @Test(groups = "reg", priority = 4)
    @Description("PATCH /todos/1 - mark todo completed")
    public void testPatchTodo() {
        response = RestAssured.given(requestSpecification)
                .basePath(APIConstants.TODOS_URL + "/1")
                .body(payloadManager.updateTodoCompletedPayload(true))
                .when()
                .patch();

        validatableResponse = response.then();
        validatableResponse.statusCode(200);

        Todo todo = payloadManager.todoFromJson(response.asString());
        assertThat(todo.getCompleted()).isTrue();
    }
}
