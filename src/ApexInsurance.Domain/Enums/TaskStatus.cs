namespace ApexInsurance.Domain.Enums
{
    /// <summary>
    /// Status of a <see cref="Entities.WorkflowTask"/>. Note: this shares its name with
    /// System.Threading.Tasks.TaskStatus - fully qualify or alias if both are in scope in the
    /// same file (e.g. `using TaskStatus = ApexInsurance.Domain.Enums.TaskStatus;`).
    /// </summary>
    public enum TaskStatus
    {
        Pending = 0,
        InProgress = 1,
        Completed = 2,
        Cancelled = 3,
        Overdue = 4
    }
}
