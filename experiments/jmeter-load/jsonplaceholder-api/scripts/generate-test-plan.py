#!/usr/bin/env python3
"""Generate JMeter test plans for JSONPlaceholder (one list GET per resource type)."""

from pathlib import Path

RESOURCES = [
    ("/posts", "GET /posts"),
    ("/comments", "GET /comments"),
    ("/albums", "GET /albums"),
    ("/photos", "GET /photos"),
    ("/todos", "GET /todos"),
    ("/users", "GET /users"),
]

SAMPLER = """        <HTTPSamplerProxy guiclass="HttpTestSampleGui" testclass="HTTPSamplerProxy" testname="{name}" enabled="true">
          <stringProp name="HTTPSampler.path">{path}</stringProp>
          <stringProp name="HTTPSampler.method">GET</stringProp>
          <boolProp name="HTTPSampler.follow_redirects">true</boolProp>
          <boolProp name="HTTPSampler.use_keepalive">true</boolProp>
        </HTTPSamplerProxy>
        <hashTree>
          <ResponseAssertion guiclass="AssertionGui" testclass="ResponseAssertion" testname="Status 200" enabled="true">
            <collectionProp name="Asserion.test_strings">
              <stringProp name="0">200</stringProp>
            </collectionProp>
            <stringProp name="Assertion.test_field">Assertion.response_code</stringProp>
            <boolProp name="Assertion.assume_success">false</boolProp>
            <intProp name="Assertion.test_type">8</intProp>
          </ResponseAssertion>
          <hashTree/>
          <DurationAssertion guiclass="DurationAssertionGui" testclass="DurationAssertion" testname="Response under 15s" enabled="true">
            <stringProp name="DurationAssertion.duration">15000</stringProp>
          </DurationAssertion>
          <hashTree/>
        </hashTree>"""

TEMPLATE = """<?xml version="1.0" encoding="UTF-8"?>
<jmeterTestPlan version="1.2" properties="5.0" jmeter="5.6.3">
  <hashTree>
    <TestPlan guiclass="TestPlanGui" testclass="TestPlan" testname="{plan_name}" enabled="true">
      <boolProp name="TestPlan.functional_mode">false</boolProp>
      <boolProp name="TestPlan.serialize_threadgroups">false</boolProp>
      <elementProp name="TestPlan.user_defined_variables" elementType="Arguments" guiclass="ArgumentsPanel" testclass="Arguments" enabled="true">
        <collectionProp name="Arguments.arguments">
          <elementProp name="BASE_HOST" elementType="Argument">
            <stringProp name="Argument.name">BASE_HOST</stringProp>
            <stringProp name="Argument.value">${{__P(BASE_HOST,jsonplaceholder.typicode.com)}}</stringProp>
            <stringProp name="Argument.metadata">=</stringProp>
          </elementProp>
        </collectionProp>
      </elementProp>
    </TestPlan>
    <hashTree>
      <ConfigTestElement guiclass="HttpDefaultsGui" testclass="ConfigTestElement" testname="HTTP Request Defaults" enabled="true">
        <stringProp name="HTTPSampler.domain">${{BASE_HOST}}</stringProp>
        <stringProp name="HTTPSampler.protocol">https</stringProp>
        <stringProp name="HTTPSampler.connect_timeout">5000</stringProp>
        <stringProp name="HTTPSampler.response_timeout">30000</stringProp>
      </ConfigTestElement>
      <hashTree/>
      <HeaderManager guiclass="HeaderPanel" testclass="HeaderManager" testname="HTTP Header Manager" enabled="true">
        <collectionProp name="HeaderManager.headers">
          <elementProp name="" elementType="Header">
            <stringProp name="Header.name">Accept</stringProp>
            <stringProp name="Header.value">application/json</stringProp>
          </elementProp>
        </collectionProp>
      </HeaderManager>
      <hashTree/>
      <ThreadGroup guiclass="ThreadGroupGui" testclass="ThreadGroup" testname="Core API Users" enabled="true">
        <intProp name="ThreadGroup.num_threads">{threads}</intProp>
        <intProp name="ThreadGroup.ramp_time">{ramp}</intProp>
        <boolProp name="ThreadGroup.scheduler">{scheduler}</boolProp>
        <stringProp name="ThreadGroup.duration">{duration}</stringProp>
        <boolProp name="ThreadGroup.same_user_on_next_iteration">true</boolProp>
        <elementProp name="ThreadGroup.main_controller" elementType="LoopController" guiclass="LoopControlPanel" testclass="LoopController" enabled="true">
          <boolProp name="LoopController.continue_forever">false</boolProp>
          <stringProp name="LoopController.loops">{loops}</stringProp>
        </elementProp>
      </ThreadGroup>
      <hashTree>
        <TransactionController guiclass="TransactionControllerGui" testclass="TransactionController" testname="Core resources" enabled="true">
          <boolProp name="TransactionController.includeTimers">false</boolProp>
        </TransactionController>
        <hashTree>
{samplers}
        </hashTree>
        <GaussianRandomTimer guiclass="GaussianRandomTimerGui" testclass="GaussianRandomTimer" testname="Think Time" enabled="true">
          <stringProp name="ConstantTimer.delay">1000</stringProp>
          <stringProp name="RandomTimer.range">2000</stringProp>
        </GaussianRandomTimer>
        <hashTree/>
      </hashTree>
    </hashTree>
  </hashTree>
</jmeterTestPlan>
"""

PLANS = {
    "smoke-test.jmx": {
        "plan_name": "JSONPlaceholder Smoke",
        "threads": 1,
        "ramp": 1,
        "loops": 3,
        "scheduler": "false",
        "duration": "",
    },
    "load-test.jmx": {
        "plan_name": "JSONPlaceholder Load",
        "threads": 20,
        "ramp": 30,
        "loops": -1,
        "scheduler": "true",
        "duration": "120",
    },
}


def main() -> None:
    out_dir = Path(__file__).resolve().parents[1] / "test-plans"
    samplers = "\n".join(SAMPLER.format(path=p, name=n) for p, n in RESOURCES)
    for filename, cfg in PLANS.items():
        content = TEMPLATE.format(samplers=samplers, **cfg)
        path = out_dir / filename
        path.write_text(content, encoding="utf-8")
        print(f"Wrote {path}")


if __name__ == "__main__":
    main()
