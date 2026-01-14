import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight, TrendingUp, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

type RecommendationsDisplayProps = {
  recommendations: {
    courses: any[];
    careerPaths: any[];
    skillGaps: any[];
  };
};

export function RecommendationsDisplay({ recommendations }: RecommendationsDisplayProps) {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5" />
            Skills Gaps
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.skillGaps.map((gap, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{gap.skill}</span>
                  <Badge variant={gap.priority === "high" ? "destructive" : "default"}>
                    {gap.priority === "high" ? "High Priority" : "Medium"}
                  </Badge>
                </div>
                <Progress value={(gap.currentLevel / gap.requiredLevel) * 100} />
                <div className="flex justify-between text-sm text-muted-foreground">
                  <span>Current level: {gap.currentLevel}%</span>
                  <span>Required level: {gap.requiredLevel}%</span>
                </div>
                <div className="text-sm text-muted-foreground">
                  {gap.marketData
                    ? <>Market growth: {gap.marketData.growth}%</>
                    : <>No market data</>
                  }
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="w-5 h-5" />
            Recommended Courses
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.courses.map((course) => (
              <Card key={course.id} className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">{course.provider}</p>
                    </div>
                    <Badge variant="outline">{course.level}</Badge>
                  </div>
                  <p className="text-sm">{course.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {course.skills.map((skill: string) => (
                      <Badge key={skill} variant="secondary">
                        {skill}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between items-center text-sm text-muted-foreground">
                    <span>Duration: {course.duration}</span>
                    <span className="flex items-center gap-1">
                      <ArrowUpRight className="w-4 h-4" />
                      Relevance: {Math.round(course.relevance * 100)}%
                    </span>
                  </div>
                  {course.url && (
                    <div className="pt-2">
                      <a href={course.url} target="_blank" rel="noopener noreferrer">
                        <Button variant="default" className="w-full">
                         Enroll in the course
                        </Button>
                      </a>
                    </div>
                  )}
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ArrowUpRight className="w-5 h-5" />
            Career Paths
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recommendations.careerPaths.map((path) => (
              <Card key={path.id} className="p-4">
                <div className="space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold">{path.title}</h3>
                      <p className="text-sm text-muted-foreground">Match: {path.match}</p>
                    </div>
                    <Badge>{path.averageSalary}</Badge>
                  </div>
                  <p className="text-sm">{path.description}</p>
                  <div className="space-y-2">
                    <div>
                      <h4 className="text-sm font-medium">Required Skills:</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {path.requiredSkills.map((skill: string) => (
                          <Badge key={skill} variant="secondary">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium">Skills to Develop:</h4>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {path.missingSkills.map((skill: string) => (
                          <Badge key={skill} variant="outline">
                            {skill}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="text-sm text-muted-foreground">
                    Croissance prévue: {path.growthRate}
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 