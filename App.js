// App.js
import React from "react";
import { StatusBar } from "react-native";
import { Provider } from "react-redux";
import store from "./app/store";

import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import RootLayout from "./Layouts/RootLayout";
import SecondLayout from "./Layouts/SecondLayout";

import SplashScreen from "./pages/SplashScreen";
import MainSelectgrade from "./pages/MainSelectgrade";
import Sign from "./pages/Sign";
import OTP from "./pages/OTP";
import ForgotPassword from "./pages/ForgotPassword";

import Home from "./pages/Home";
import Live from "./pages/Live";
import LMS from "./pages/LMS";
import Result from "./pages/Result";
import Profile from "./pages/Profile";

import Lessons from "./pages/Lessions";
import ViewLesson from "./pages/ViewLesson";
import IndexNumber from "./pages/IndexNumber";
import Subjects from "./pages/Subject";
import SubjectWithTeachers from "./pages/SubjectWithteacher";

import DailyQuiz from "./pages/DailyQuiz";
import TopicWisePaper from "./pages/TopicWisepaper";
import ModelPaper from "./pages/Modelpaper";
import PastPapers from "./pages/Pastpapers";

import EnrollSubjects from "./pages/EnrollSubjects";
import DailyQuizMenu from "./pages/DailyQuizzMenu";
import TopicWiseMenu from "./pages/TopicWisemenu";
import ModelPaperMenu from "./pages/ModelPaperMenu";
import PastpaperMenu from "./pages/PastpaperMenu";

import PaperPage from "./pages/paper";

const Stack = createNativeStackNavigator();

const withSecondLayout = (ScreenComponent) => {
  return function WrappedScreen(props) {
    return (
      <SecondLayout>
        <ScreenComponent {...props} />
      </SecondLayout>
    );
  };
};

const HomeWithLayout = withSecondLayout(Home);
const LiveWithLayout = withSecondLayout(Live);
const LMSWithLayout = withSecondLayout(LMS);
const ResultWithLayout = withSecondLayout(Result);
const ProfileWithLayout = withSecondLayout(Profile);
const LessonsWithLayout = withSecondLayout(Lessons);
const ViewLessonWithLayout = withSecondLayout(ViewLesson);
const IndexNumberWithLayout = withSecondLayout(IndexNumber);
const SubjectsWithLayout = withSecondLayout(Subjects);
const SubjectWithTeachersWithLayout = withSecondLayout(SubjectWithTeachers);
const EnrollSubjectsWithLayout = withSecondLayout(EnrollSubjects);
const DailyQuizWithLayout = withSecondLayout(DailyQuiz);
const TopicWisePaperWithLayout = withSecondLayout(TopicWisePaper);
const ModelPaperWithLayout = withSecondLayout(ModelPaper);
const PastPapersWithLayout = withSecondLayout(PastPapers);
const DailyQuizMenuWithLayout = withSecondLayout(DailyQuizMenu);
const TopicWiseMenuWithLayout = withSecondLayout(TopicWiseMenu);
const ModelPaperMenuWithLayout = withSecondLayout(ModelPaperMenu);
const PastpaperMenuWithLayout = withSecondLayout(PastpaperMenu);

export default function App() {
  return (
    <Provider store={store}>
      <NavigationContainer>
        <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />

        <RootLayout>
          <Stack.Navigator
            screenOptions={{ headerShown: false }}
            initialRouteName="Splash"
          >
            <Stack.Screen name="Splash" component={SplashScreen} />

            {/* ✅ Auth flow */}
            <Stack.Screen name="Sign" component={Sign} />
            <Stack.Screen name="OTP" component={OTP} />
            <Stack.Screen name="ForgotPassword" component={ForgotPassword} />
            <Stack.Screen name="MainSelectgrade" component={MainSelectgrade} />

            {/* ✅ Main app */}
            <Stack.Screen name="Home" component={HomeWithLayout} />
            <Stack.Screen name="Live" component={LiveWithLayout} />
            <Stack.Screen name="LMS" component={LMSWithLayout} />
            <Stack.Screen name="Result" component={ResultWithLayout} />
            <Stack.Screen name="Profile" component={ProfileWithLayout} />

            {/* Other pages */}
            <Stack.Screen name="Subjects" component={SubjectsWithLayout} />
            <Stack.Screen
              name="SubjectWithTeachers"
              component={SubjectWithTeachersWithLayout}
            />
            <Stack.Screen name="IndexNumber" component={IndexNumberWithLayout} />
            <Stack.Screen name="Lessons" component={LessonsWithLayout} />
            <Stack.Screen name="ViewLesson" component={ViewLessonWithLayout} />
            <Stack.Screen
              name="EnrollSubjects"
              component={EnrollSubjectsWithLayout}
            />

            <Stack.Screen name="DailyQuiz" component={DailyQuizWithLayout} />
            <Stack.Screen
              name="TopicWisePaper"
              component={TopicWisePaperWithLayout}
            />
            <Stack.Screen name="ModelPaper" component={ModelPaperWithLayout} />
            <Stack.Screen name="PastPapers" component={PastPapersWithLayout} />

            <Stack.Screen
              name="DailyQuizMenu"
              component={DailyQuizMenuWithLayout}
            />
            <Stack.Screen
              name="TopicWiseMenu"
              component={TopicWiseMenuWithLayout}
            />
            <Stack.Screen
              name="ModelPaperMenu"
              component={ModelPaperMenuWithLayout}
            />
            <Stack.Screen
              name="PastpaperMenu"
              component={PastpaperMenuWithLayout}
            />

            {/* Paper */}
            <Stack.Screen name="PaperPage" component={PaperPage} />
          </Stack.Navigator>
        </RootLayout>
      </NavigationContainer>
    </Provider>
  );
}
