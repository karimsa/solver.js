# 0.0.3 (unreleased)

 - fix number trust issues (add check for every number in every calculation, other than median)
 - simplify and upgrade dependencies
 - add basic relationship type guessing (between linear and exponential) -> stream-based guessing is supported; in case data becomes available late.
 - upgrade to node 0.12.x
 - add tests for new features

# 0.0.2 (latest)

 - fix the 'for in' prototype check (solver starts to screw itself when you extend any prototypes)

## 0.0.1

 - statistical datasets: mean, median, mode, deviation, coefficient of variation, five number summary, interquartile range, first second and third quartiles.
 - math extensions: convert number to constant, fractional extension, integration, proper rounding, decimal precision configuration.
 - data solving: linear and exponential simple solutions; stream-based solutions.
