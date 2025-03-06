import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'

import { FormTextArea } from '@/components/controll/FormTextArea'
import { ResponseDataUserProfile } from '@/components/posts/types'
import { DatePIckerForProfileSettings } from '@/components/profile-settings/general-info-settings/general-info-form/DatePIckerForProfileSettings'
import { FormInputGroup } from '@/components/profile-settings/general-info-settings/general-info-form/FormInputGroup'
import { SelectBlock } from '@/components/profile-settings/general-info-settings/general-info-form/SelectBlock'
import {
  UserGeneralInfoData,
  userGeneralInfoSchema,
} from '@/components/profile-settings/general-info-settings/general-info-form/schema'
import { Toast } from '@/components/toast/Toast'
import { useTranslation } from '@/hooks/useTranslation'
import { useUpdateProfileMutation } from '@/services/inctagram.profile.service'
import { Button } from '@chrizzo/ui-kit'
import { DevTool } from '@hookform/devtools'
import { zodResolver } from '@hookform/resolvers/zod'
import clsx from 'clsx'
import dayjs, { Dayjs } from 'dayjs'
import { toast } from 'sonner'

import pageStyles from './form.module.scss'
import s from '@/components/toast/toast.module.scss'

type Props = {
  mobile: boolean
  profile: ResponseDataUserProfile | undefined
}

export function GeneralInfoForm(props: Props) {
  /**
   * хук RTKQ для изменения данных профиля
   */
  const [updateProfile] = useUpdateProfileMutation()
  /**
   * стейт контроля взаимодействия юзера с полем даты рождения. Нужно для
   * разблокировки кнопки "Отправить изменения"
   */
  const [isDirtyBirthDate, setIsDirtyBirthDate] = useState(false)

  /**
   * react hook form
   */
  const {
    control,
    formState: { errors, isDirty, isSubmitting, isValidating },
    getValues,
    handleSubmit,
    register,
    reset,
    setValue,
    trigger,
    watch,
  } = useForm<UserGeneralInfoData>({
    mode: 'onChange',
    resolver: zodResolver(userGeneralInfoSchema),
  })

  /**
   * контроль за полями формы. Вызывает ререндер при onChange в поле. Нужно для фиксации вводимой информации,
   * после чего её нужно сохранить в локалсторэдже. Это нужно для того, чтобы можно было
   * сохранить эти данные в полях, если мы заполнили поля, но не отправили изменения на сервер, а потом изменили
   * аватарку. После изменения аватарки подтягиваются данные с сервера и мы теряем введённые ранее данные
   */
  const [
    watchShowFirstName,
    watchShowLastName,
    watchShowUserName,
    watchShowAboutMe,
    watchShowCity,
    watchShowCountry,
  ] = watch(['firstName', 'lastName', 'userName', 'aboutMe', 'city', 'country'])

  if (
    watchShowFirstName ||
    watchShowLastName ||
    watchShowUserName ||
    watchShowAboutMe ||
    watchShowCity ||
    watchShowCountry
  ) {
    const settings = {
      watchShowAboutMe,
      watchShowCity,
      watchShowCountry,
      watchShowFirstName,
      watchShowLastName,
      watchShowUserName,
    }

    if (typeof window !== 'undefined') {
      localStorage.setItem('settingsMyProfile', JSON.stringify(settings))
    }
  }

  /**
   * хук интернационализации
   */
  const { router, t } = useTranslation()

  /**
   * обработчик формы
   * @param data - данные из формы
   */
  const makeRequest = async (data: any) => {
    /**
     * получаем текущую дату и время и в поле "дата рождения" из формы добавляем время,
     * т.к. на сервер должны идти данные в формате "2024-09-14T15:19:48.060Z",
     * а из формы приходит только дата
     */
    const now = new Date()
    const currentTime = now.toISOString().split('T')[1].split('.')[0] + 'Z'

    data.dateOfBirth = data?.dateOfBirth?.split('.').reverse().join('-') + 'T' + currentTime
    /**
     * разблокируем кнопку отправки изменений
     */
    setIsDirtyBirthDate(false)
    try {
      await updateProfile(data).unwrap()
      /**
       * typeof window !== 'undefined' - проверка на среду выполнения - сервер или клиент. Код выполняется
       * только на клиенте. Иначе при билде приложения есть ошибка (если б не использовали "next-redux-wrapper", то
       * эту проверку можно было бы не делать).
       */
      if (typeof window !== 'undefined') {
        localStorage.removeItem('settingProfile')
      }
      /**
       * всплывашка
       */
      toast.custom(
        jsx => (
          <Toast onDismiss={() => toast.dismiss(jsx)} title={t.profile.settings.toast.success} />
        ),
        {
          className: s.succesToast,
          duration: Infinity,
        }
      )
    } catch (error) {
      /**
       * всплывашка
       */
      toast.custom(
        jsx => (
          <Toast onDismiss={() => toast.dismiss(jsx)} title={t.profile.settings.toast.error} />
        ),
        {
          className: s.errorToast,
        }
      )
    }
  }
  /**
   * условия блокировки кнопки отправки данных. Если есть ошибки в обязательных полях и в поле даты рождения,
   * если идёт процесс отправки, если ввели данные в любое поле формы, если идёт проверка валидации
   */
  const submitDisabled =
    (!isSubmitting && !isDirty && !isValidating && !isDirtyBirthDate) ||
    !!errors.userName ||
    !!errors.lastName ||
    !!errors.firstName ||
    !!errors.dateOfBirth
  /**
   * регистрируем поле "дата рождения"
   */
  const { name } = register('dateOfBirth')
  /**
   * Обработчик изменений календаря
   * @param v - event. Это хитрый объект с типизацией из бибилиотеки dayjs.
   */
  const handleChanges = (v: Dayjs | null) => {
    if (v) {
      /**
       * если объект с данными есть, с помощью метода format (библиотеки dayjs)
       * преобразуем дату в нужный нам формат
       */
      const formattedDate = v.format('DD.MM.YYYY')

      /**
       * typeof window !== 'undefined' - проверка на среду выполнения - сервер или клиент. Код выполняется
       * только на клиенте. Иначе при билде приложения есть ошибка (если б не использовали "next-redux-wrapper", то
       * эту проверку можно было бы не делать).
       */
      if (typeof window !== 'undefined') {
        localStorage.setItem('dataOfBirth', formattedDate)
      }
      /**
       * передаём дату в форму
       */
      setValue('dateOfBirth', formattedDate)
      /**
       * запускаем валидацию вручную. Если всё хорошо, то сбрасываем стейт
       * взаимодействия юзера с полем даты для блокировки кнопки отправки данных
       */
      trigger('dateOfBirth').then(x => {
        if (x) {
          setIsDirtyBirthDate(true)
        }
      })
    }
  }
  /**
   * обработчик навигации на страницу политики.
   * Сохраняем в локалстрэдже данные из формы. Это нужно, если мы со страницы политики вернёмся
   * назад на setting, то из сторэйджа подтянем данные и засунем их в поля формы. Так по ТЗ
   */
  const toPrivacyPolity = () => {
    const getValuesForm = getValues()

    /**
     * typeof window !== 'undefined' - проверка на среду выполнения - сервер или клиент. Код выполняется
     * только на клиенте. Иначе при билде приложения есть ошибка (если б не использовали "next-redux-wrapper", то
     * эту проверку можно было бы не делать).
     */
    if (typeof window !== 'undefined') {
      localStorage.setItem('settingProfile', JSON.stringify(getValuesForm))
    }
    void router.push('/privacyPolicy')
  }

  /**
   *это нужно для автоматического заполнения полей формы текущими данными с сервера.
   * Использовать defaultValue в useForm в текущей архитектуре компонента не получилось,
   * т.к. изначально в компонент приходят пустые данные и они идут в defaultValue,
   * а переопределить их потом нельзя. Если ввели данные в поля, но не передали их на сервер (они сохранились
   * в локалсторэдже), а потом поменяли аватарку, то заполняем поля данными из локалсторэйджа.
   * Если же мы только зашли в настройки, то в локалсторэйдже нет данных и поля заполняем данными с сервера
   */
  useEffect(() => {
    const firstNameFromLocalStorage = localStorage.getItem('settingsMyProfile')

    if (firstNameFromLocalStorage) {
      const jsonParsedData = JSON.parse(firstNameFromLocalStorage)

      reset({
        aboutMe: jsonParsedData.watchShowAboutMe,
        city: jsonParsedData.watchShowCity,
        country: jsonParsedData.watchShowCountry,
        firstName: jsonParsedData.watchShowFirstName,
        lastName: jsonParsedData.watchShowLastName,
        userName: jsonParsedData.watchShowUserName,
      })
    }

    if (props.profile && !firstNameFromLocalStorage) {
      reset({
        aboutMe: props.profile.aboutMe ?? '',
        city: props.profile.city ?? '',
        country: props.profile.country ?? '',
        firstName: props.profile.firstName ?? '',
        lastName: props.profile.lastName ?? '',
        userName: props.profile.userName ?? '',
      })
    }
  }, [props.profile])

  /**
   * вытягиваем из локалсторэйджа данные и сетаем их в поля формы. Это нужно, если мы со страницы
   * политики вернулись назад на setting, то в форме должны быть ранее введённые данные. Так по ТЗ
   */

  useEffect(() => {
    /**
     * typeof window !== 'undefined' - проверка на среду выполнения - сервер или клиент. Код выполняется
     * только на клиенте. Иначе при билде приложения есть ошибка (если б не использовали "next-redux-wrapper", то
     * эту проверку можно было бы не делать).
     */
    if (typeof window !== 'undefined') {
      const savedDataFromForm = localStorage.getItem('settingProfile')

      if (savedDataFromForm) {
        const parsedSavedDataFromForm = JSON.parse(savedDataFromForm)

        reset(parsedSavedDataFromForm)
      }
    }
    /**
     * если компонент размонтируется из-за перехода на другую страницу, то удаляем локалсторэйдж,
     * если компонент размонтируется из-за отправки аватарки, то не удаляем, он нам понадобится для
     * заполнения поля firsName после смены аватарки, т.к. придут данные с сервера для поля firstName, но
     * они не должны перезатереть данные из локалсторэёджа
     */

    return () => {
      if (!window.location.pathname.includes('generalInformation')) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('settingsMyProfile')
        }
      }
      if (
        !window.location.pathname.includes('privacyPolicy') &&
        !window.location.pathname.includes('generalInformation')
      ) {
        if (typeof window !== 'undefined') {
          localStorage.removeItem('dataOfBirth')
        }
        // eslint-disable-next-line max-lines
      }
    }
  }, [])
  /**
   * Это логика передачи в Календарь дефолтного значения даты. При первом рендере данные будут из пропсов.
   * Если ввели невалидную дату и потом перешли на страницу политики, то по возврату на страницу setting,
   * мы долджны в каледарь передать ранее введённое значение. Берём его из локалсторэйджа. Если нет ни того,
   * ни другого, то передаём null
   */

  const getDataBirthFromStorage =
    typeof window !== 'undefined' ? localStorage.getItem('dataOfBirth') : null

  let defaultDateBirth = null

  if (getDataBirthFromStorage) {
    defaultDateBirth = dayjs(getDataBirthFromStorage.split('.').reverse().join('-'))
  } else if (props.profile?.dateOfBirth) {
    defaultDateBirth = dayjs(props?.profile?.dateOfBirth?.split('T')[0])
  } else {
    defaultDateBirth = null
  }

  return (
    <>
      <DevTool control={control} />
      <form
        className={clsx(pageStyles.form, props.mobile && pageStyles.mobile)}
        onSubmit={handleSubmit(makeRequest)}
      >
        <FormInputGroup control={control} errors={errors} />
        <DatePIckerForProfileSettings
          defaultValue={defaultDateBirth}
          errors={errors}
          name={name}
          onChange={handleChanges}
          onClick={toPrivacyPolity}
        />
        <SelectBlock control={control} mobile={props.mobile} />
        <FormTextArea
          className={pageStyles.aboutMe}
          control={control}
          label={t.profile.settings.aboutMe}
          name={'aboutMe'}
          placeholder={t.profile.settings.aboutMePlaceholder}
        />
        <Button className={pageStyles.submitButton} disabled={submitDisabled} type={'submit'}>
          {t.profile.settings.saveChangeButton}
        </Button>
      </form>
    </>
  )
}
