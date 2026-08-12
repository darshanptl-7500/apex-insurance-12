using System;
using System.Collections.Generic;
using System.Linq;
using System.Linq.Expressions;

namespace ApexInsurance.Data.Repositories
{
    /// <summary>
    /// Generic repository abstraction over a single entity type. Specialized repositories
    /// extend this with domain-specific query methods (see <see cref="Repository{T}"/>).
    /// </summary>
    public interface IRepository<T> where T : class
    {
        T GetById(int id);
        IEnumerable<T> GetAll();
        IEnumerable<T> Find(Expression<Func<T, bool>> predicate);
        T FindOne(Expression<Func<T, bool>> predicate);
        IQueryable<T> Query();
        bool Any(Expression<Func<T, bool>> predicate);
        int Count(Expression<Func<T, bool>> predicate = null);
        void Add(T entity);
        void AddRange(IEnumerable<T> entities);
        void Update(T entity);
        void Remove(T entity);
        void RemoveRange(IEnumerable<T> entities);
    }
}
