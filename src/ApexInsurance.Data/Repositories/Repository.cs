using System;
using System.Collections.Generic;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Linq.Expressions;

namespace ApexInsurance.Data.Repositories
{
    public class Repository<T> : IRepository<T> where T : class
    {
        protected readonly ApexInsuranceDbContext Context;
        protected readonly DbSet<T> DbSet;

        public Repository(ApexInsuranceDbContext context)
        {
            Context = context ?? throw new ArgumentNullException(nameof(context));
            DbSet = context.Set<T>();
        }

        public virtual T GetById(int id)
        {
            return DbSet.Find(id);
        }

        public virtual IEnumerable<T> GetAll()
        {
            return DbSet.ToList();
        }

        public virtual IEnumerable<T> Find(Expression<Func<T, bool>> predicate)
        {
            return DbSet.Where(predicate).ToList();
        }

        public virtual T FindOne(Expression<Func<T, bool>> predicate)
        {
            return DbSet.FirstOrDefault(predicate);
        }

        public virtual IQueryable<T> Query()
        {
            return DbSet.AsQueryable();
        }

        public virtual bool Any(Expression<Func<T, bool>> predicate)
        {
            return DbSet.Any(predicate);
        }

        public virtual int Count(Expression<Func<T, bool>> predicate = null)
        {
            return predicate == null ? DbSet.Count() : DbSet.Count(predicate);
        }

        public virtual void Add(T entity)
        {
            DbSet.Add(entity);
        }

        public virtual void AddRange(IEnumerable<T> entities)
        {
            DbSet.AddRange(entities);
        }

        public virtual void Update(T entity)
        {
            var entry = Context.Entry(entity);
            if (entry.State == EntityState.Detached)
            {
                DbSet.Attach(entity);
            }
            entry.State = EntityState.Modified;
        }

        public virtual void Remove(T entity)
        {
            if (Context.Entry(entity).State == EntityState.Detached)
            {
                DbSet.Attach(entity);
            }
            DbSet.Remove(entity);
        }

        public virtual void RemoveRange(IEnumerable<T> entities)
        {
            DbSet.RemoveRange(entities);
        }
    }
}
